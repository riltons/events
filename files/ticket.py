from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'), nullable=False)
    
    # Informações do ingresso
    ticket_type = db.Column(db.String(50), nullable=False)  # 'individual', 'mesa', 'vip'
    price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='active')  # 'active', 'used', 'cancelled'
    
    # QR Code e validação
    qr_code = db.Column(db.Text)
    validation_code = db.Column(db.String(20), unique=True)
    validated_at = db.Column(db.DateTime)
    validated_by = db.Column(db.String(100))
    
    # Informações do portador
    holder_name = db.Column(db.String(100))
    holder_email = db.Column(db.String(100))
    holder_phone = db.Column(db.String(20))
    holder_document = db.Column(db.String(20))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    event = db.relationship('Event', backref='tickets')
    user = db.relationship('User', backref='tickets')
    order = db.relationship('Order', backref='tickets')
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'user_id': self.user_id,
            'order_id': self.order_id,
            'ticket_type': self.ticket_type,
            'price': self.price,
            'status': self.status,
            'qr_code': self.qr_code,
            'validation_code': self.validation_code,
            'validated_at': self.validated_at.isoformat() if self.validated_at else None,
            'validated_by': self.validated_by,
            'holder_name': self.holder_name,
            'holder_email': self.holder_email,
            'holder_phone': self.holder_phone,
            'holder_document': self.holder_document,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    
    # Informações do pedido
    total_amount = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    ticket_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'paid', 'cancelled', 'refunded'
    
    # Informações de pagamento
    payment_method = db.Column(db.String(20))  # 'credit_card', 'pix', 'boleto'
    payment_id = db.Column(db.String(100))  # ID do Stripe
    payment_intent_id = db.Column(db.String(100))
    payment_status = db.Column(db.String(20))
    paid_at = db.Column(db.DateTime)
    
    # Informações de entrega
    delivery_method = db.Column(db.String(20), default='digital')  # 'digital', 'physical'
    delivery_address = db.Column(db.Text)
    delivery_status = db.Column(db.String(20), default='pending')
    delivered_at = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    user = db.relationship('User', backref='orders')
    event = db.relationship('Event', backref='orders')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'total_amount': self.total_amount,
            'quantity': self.quantity,
            'ticket_type': self.ticket_type,
            'status': self.status,
            'payment_method': self.payment_method,
            'payment_id': self.payment_id,
            'payment_intent_id': self.payment_intent_id,
            'payment_status': self.payment_status,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'delivery_method': self.delivery_method,
            'delivery_address': self.delivery_address,
            'delivery_status': self.delivery_status,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'tickets': [ticket.to_dict() for ticket in self.tickets]
        }

class EventTicketType(db.Model):
    __tablename__ = 'event_ticket_types'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    
    # Informações do tipo de ingresso
    name = db.Column(db.String(100), nullable=False)  # 'Individual', 'Mesa VIP', 'Camarote'
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Integer)  # Quantidade disponível
    sold = db.Column(db.Integer, default=0)  # Quantidade vendida
    
    # Configurações
    is_active = db.Column(db.Boolean, default=True)
    sale_start = db.Column(db.DateTime)
    sale_end = db.Column(db.DateTime)
    min_quantity = db.Column(db.Integer, default=1)
    max_quantity = db.Column(db.Integer, default=10)
    
    # Benefícios inclusos
    includes = db.Column(db.Text)  # JSON com lista de benefícios
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    event = db.relationship('Event', backref='ticket_types')
    
    @property
    def available(self):
        if self.capacity is None:
            return True
        return (self.capacity - self.sold) > 0
    
    @property
    def available_quantity(self):
        if self.capacity is None:
            return 999
        return max(0, self.capacity - self.sold)
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'capacity': self.capacity,
            'sold': self.sold,
            'available': self.available,
            'available_quantity': self.available_quantity,
            'is_active': self.is_active,
            'sale_start': self.sale_start.isoformat() if self.sale_start else None,
            'sale_end': self.sale_end.isoformat() if self.sale_end else None,
            'min_quantity': self.min_quantity,
            'max_quantity': self.max_quantity,
            'includes': self.includes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

