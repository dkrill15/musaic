from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True)
    pop_long_term = Column(Float)
    pop_medium_term = Column(Float)
    pop_short_term = Column(Float)
    mood_long_term = Column(Float)
    mood_medium_term = Column(Float)
    mood_short_term = Column(Float)
    profile_image_url = Column(String)
    public_results = Column(Boolean)
    last_updated = Column(DateTime)

    def __init__(self, id, pl, pm, ps, ml, mm, ms, profile, public, update):
        self.id = id
        self.pop_long_term = pl
        self.pop_medium_term = pm
        self.pop_short_term = ps
        self.mood_long_term = ml
        self.mood_medium_term = mm
        self.mood_short_term = ms
        self.profile_image_url = profile
        self.public_results = public
        self.last_updated = update
    

class Artist(Base):
    __tablename__ = 'artists'

    id = Column(String, primary_key=True)
    name = Column(String)
    pop_score = Column(Float)
    mood_score = Column(Float)
    profile_image_url = Column(String)
    last_updated = Column(DateTime)
    followers = Column(Integer)

    def __init__(self, id, n, ps, ms, profile, update, f):
        self.id = id
        self.name = n
        self.pop_score = ps
        self.mood_score = ms
        self.profile_image_url = profile
        self.last_updated = update
        self.followers = f
        
    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}



