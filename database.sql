-- Tabela User
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  code INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cellphone TEXT,
  pin TEXT
);

-- Tabela Institution
CREATE TABLE IF NOT EXISTS Institution (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Tabela Shift (enum simulada)
CREATE TYPE ShiftEnum AS ENUM ('Manha', 'Tarde', 'Noite');

-- Tabela Student
CREATE TABLE IF NOT EXISTS Student (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  institution_id INTEGER NOT NULL REFERENCES Institution(id),
  president BOOLEAN DEFAULT FALSE,
  associate BOOLEAN DEFAULT FALSE,
  shift ShiftEnum NOT NULL
);

-- Tabela Hitchhiker (carona, sem registro no sistema, só nome e destino)
CREATE TABLE IF NOT EXISTS Hitchhiker (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL
);

-- Tabela Bus (ônibus)
CREATE TABLE IF NOT EXISTS Bus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  maxCapacity INTEGER NOT NULL
);

-- Tabela NoticeBoard (Avisos)
CREATE TABLE IF NOT EXISTS NoticeBoard (
  id SERIAL PRIMARY KEY,
  notice TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE SET NULL
);

-- Tabela PassengersList (lista de passageiros)
CREATE TABLE IF NOT EXISTS PassengersList (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  tripType TEXT NOT NULL,
  bus_id INTEGER NOT NULL REFERENCES Bus(id)
);

-- Relação entre PassengersList e Students (muitos para muitos)
CREATE TABLE IF NOT EXISTS PassengersList_Students (
  passengersList_id INTEGER NOT NULL REFERENCES PassengersList(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES Student(id) ON DELETE CASCADE,
  PRIMARY KEY (passengersList_id, student_id)
);

-- Relação entre PassengersList e Hitchhikers (muitos para muitos)
CREATE TABLE IF NOT EXISTS PassengersList_Hitchhikers (
  passengersList_id INTEGER NOT NULL REFERENCES PassengersList(id) ON DELETE CASCADE,
  hitchhiker_id INTEGER NOT NULL REFERENCES Hitchhiker(id) ON DELETE CASCADE,
  PRIMARY KEY (passengersList_id, hitchhiker_id)
);
