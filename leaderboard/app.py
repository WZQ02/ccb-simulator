import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Score

app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leaderboard.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db.init_app(app)

# Initialize Flask-CORS
CORS(app)

@app.route('/')
def index():
    return 'Leaderboard Backend is running!'

# This function will be used to create the database tables.
# It should be run once, e.g., in a separate script or interactively.
# For development, we can create it here, but for production, typically handled by migrations.
def create_db():
    with app.app_context():
        db.create_all()

@app.route('/api/scores/submit', methods=['POST'])
def submit_score():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    username = data.get('username')
    mode = data.get('mode')
    ccb_score = data.get('ccb_score')
    treads_count = data.get('treads_count')
    cps = data.get('cps')

    # Basic validation
    if not all([username, mode, ccb_score is not None, treads_count is not None, cps is not None]):
        return jsonify({"error": "Missing data"}), 400
    
    if not isinstance(username, str) or len(username) > 80:
        return jsonify({"error": "Invalid username"}), 400
    if mode not in ['classic', 'challenge']:
        return jsonify({"error": "Invalid mode"}), 400
    if not isinstance(ccb_score, (int, float)) or ccb_score < 0:
        return jsonify({"error": "Invalid ccb_score"}), 400
    if not isinstance(treads_count, (int, float)) or treads_count < 0:
        return jsonify({"error": "Invalid treads_count"}), 400
    if not isinstance(cps, (int, float)) or cps < 0:
        return jsonify({"error": "Invalid cps"}), 400

    try:
        new_score = Score(
            username=username,
            mode=mode,
            ccb_score=ccb_score,
            treads_count=treads_count,
            cps=cps
        )
        db.session.add(new_score)
        db.session.commit()
        return jsonify({"message": "Score submitted successfully", "id": new_score.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    mode = request.args.get('mode')
    criteria = request.args.get('criteria')

    if mode not in ['classic', 'challenge']:
        return jsonify({"error": "Invalid mode specified. Use 'classic' or 'challenge'."}), 400
    if criteria not in ['ccb_score', 'treads_count', 'cps']:
        return jsonify({"error": "Invalid criteria specified. Use 'ccb_score', 'treads_count' or 'cps'."}), 400

    with app.app_context():
        # Subquery to get the max score for each user in the given mode for the selected criteria
        # This handles the requirement of showing only the best score per user.
        subquery = db.session.query(
            Score.username,
            db.func.max(getattr(Score, criteria)).label('max_criteria')
        ).filter_by(mode=mode).group_by(Score.username).subquery()
        
        # Join with the main Score table to get all details of the best score for each user
        # Note: This approach might return multiple rows for a user if they have identical max_criteria scores
        # across other columns. For simplicity, we'll take the first one found for now.
        leaderboard_query = db.session.query(Score).join(
            subquery,
            db.and_(
                Score.username == subquery.c.username,
                getattr(Score, criteria) == subquery.c.max_criteria
            )
        ).order_by(db.desc(getattr(Score, criteria)))

        # If multiple entries exist for the same username with the same best score for the criteria,
        # we need to pick one. A simple way is to use a dictionary to keep track of unique usernames.
        # This ensures each user appears only once.
        unique_scores = {}
        for score in leaderboard_query.all():
            if score.username not in unique_scores:
                unique_scores[score.username] = score
            else:
                # If a user already has an entry, compare and keep the better one if criteria are same.
                # Or just keep the first one found, which is what we'll do for simplicity.
                pass # Already added the first best score for this user

        leaderboard_data = [score.to_dict() for score in unique_scores.values()]
        
        return jsonify(leaderboard_data)

if __name__ == '__main__':
    # In a real application, you might use Flask Migrate for database creation/migrations.
    # For simplicity in this project, we'll create it if it doesn't exist.
    if not os.path.exists('leaderboard.db'):
        create_db()
    app.run(debug=True, port=5501)
