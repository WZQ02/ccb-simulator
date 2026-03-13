from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    mode = db.Column(db.String(20), nullable=False)  # 'classic' or 'challenge'
    ccb_score = db.Column(db.Integer, nullable=False)
    treads_count = db.Column(db.Integer, nullable=False)
    cps = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Score {self.username} - {self.mode} - {self.ccb_score}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'mode': self.mode,
            'ccb_score': self.ccb_score,
            'treads_count': self.treads_count,
            'cps': self.cps,
            'timestamp': self.timestamp.isoformat()
        }
