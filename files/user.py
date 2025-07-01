from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(200))
    avatar_url = db.Column(db.String(500))
    bio = db.Column(db.Text)
    
    # Redes sociais
    instagram_handle = db.Column(db.String(100))
    facebook_handle = db.Column(db.String(100))
    
    # Metadados
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relacionamentos
    medias = db.relationship('Media', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'avatar_url': self.avatar_url,
            'bio': self.bio,
            'instagram_handle': self.instagram_handle,
            'facebook_handle': self.facebook_handle,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }
