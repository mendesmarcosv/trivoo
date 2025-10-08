-- =====================================================
-- SEED DATA - Popular banco de dados com dados do JSON
-- =====================================================

-- Limpar dados existentes (exceto sports que já estão no schema.sql)
DELETE FROM events;
DELETE FROM teachers;
DELETE FROM clubs;

-- =====================================================
-- INSERIR CLUBES
-- =====================================================
INSERT INTO clubs (name, distance_km, sports, image_url, address, latitude, longitude) VALUES
('Centro Horizonte', 9, ARRAY['Goalball', 'Bocha paralímpica'], '/images/clubs/Centro Horizonte.png', 'Rua das Flores, 123, Icaraí', -22.9068, -43.1729),
('Boulder Lab', 11, ARRAY['Escalada indoor', 'Slackline'], '/images/clubs/Boulder Lab.png', 'Av. Roberto Silveira, 456, Centro', -22.8890, -43.1250),
('KinBall & Floorball Hub', 4, ARRAY['Kin-Ball', 'Floorball'], '/images/clubs/KinBall & Floorball Hub.png', 'Rua dos Esportes, 789, São Francisco', -22.8850, -43.1100),
('Campo Verde Footgolf', 28, ARRAY['Footgolf', 'Ultimate Frisbee'], '/images/clubs/Campo Verde Footgolf.png', 'Estrada Verde, 321, Piratininga', -22.9500, -43.0800),
('Biribol & Natação Adaptada São Francisco', 15, ARRAY['Biribol', 'Natação Adaptada'], '/images/clubs/Biribol & Natação Adaptada São Francisco.png', 'Rua São Francisco, 654, São Francisco', -22.8900, -43.1150),
('Tamboréu Praia Clube', 16, ARRAY['Tamboréu', 'Beach Ultimate'], '/images/clubs/Tamboréu Praia Clube.png', 'Praia de Camboinhas, 987, Camboinhas', -22.9300, -43.0600),
('Hangar 101', 24, ARRAY['Corrida de Drone'], '/images/clubs/Hangar 101.png', 'Rua do Hangar, 101, Pendotiba', -22.9200, -43.0900);

-- =====================================================
-- INSERIR PROFESSORES
-- =====================================================
INSERT INTO teachers (name, sport, rating, total_reviews, location, avatar_url, price_per_hour) VALUES
('Victor Nascimento', 'Tamboréu', 4.9, 45, 'Praia de Charitas', '/images/teachers/profile Victor Nascimento.png', 150.00),
('Helena Moraes', 'Esgrima', 4.7, 32, 'Sala de Esgrima São Domingos', '/images/teachers/profile Helena Moraes.png', 140.00),
('Lucas Prado', 'Escalada', 4.4, 28, 'Escadarias do Ingá', '/images/teachers/profile Lucas Prado.png', 120.00),
('Ana Bechara', 'Corrida', 4.6, 38, 'Orla da Boa Viagem', '/images/teachers/profile Ana Bechara.png', 110.00),
('Mateus Furlan', 'Natação', 4.5, 40, 'Complexo Aquático Pendotiba', '/images/teachers/profile Mateus Furlan.png', 130.00),
('Clarice Neri', 'Beach Tennis', 4.8, 35, 'Arena de Squash Santa Rosa', '/images/teachers/profile Clarice Neri.png', 145.00),
('Rogério Saito', 'Cross Fit', 4.3, 25, 'Centro de Treino Várzea das Moças', '/images/teachers/profile Rogério Saito.png', 100.00),
('Naomi Tanaka', 'Tênis de Mesa', 4.9, 50, 'Ginásio São Domingos', '/images/teachers/profile Naomi Tanaka.png', 155.00),
('Gabriel Mitter', 'Futebol', 4.2, 22, 'Campo Caio Martins', '/images/teachers/profile Gabriel Mitter.png', 95.00),
('Yara Potiguara', 'Ginástica Rítmica', 4.5, 30, 'Área Verde Maria Paula', '/images/teachers/profile Yara Potiguara.png', 125.00),
('Bruno Dantas', 'Escalada', 4.6, 33, 'Climb House Pendotiba', '/images/teachers/profile Bruno Dantas.png', 135.00);

-- =====================================================
-- INSERIR EVENTOS
-- =====================================================
INSERT INTO events (title, date, time, location, image_url, sport, max_participants, current_participants, price) VALUES
('Trilha de Orientação Camboinhas', '2025-10-14', '08:30', 'Parque Estadual da Serra da Tiririca (acesso Camboinhas)', '/images/events/Trilha de Orientação Camboinhas.png', 'Orientação', 30, 18, 25.00),
('Night Parkour Meetup', '2025-10-09', '19:00', 'Esplanada do Caminho Niemeyer', '/images/events/Night Parkour Meetup.png', 'Parkour', 25, 15, 0.00),
('Korfebol Aberto da Baía', '2025-10-18', '09:00', 'Quadra Poliesportiva São Lourenço', '/images/events/Korfebol Aberto da Baía.png', 'Korfebol', 20, 12, 15.00),
('Circuito Inclusivo - Bocha na Praça', '2025-10-25', '15:00', 'Praça Estephânia de Carvalho', '/images/events/Circuito Inclusivo - Bocha na Praça.png', 'Bocha', 40, 25, 0.00),
('Open de Esgrima — Iniciação & Amistoso', '2025-11-01', '20:00', 'Sala de Esgrima São Domingos', '/images/events/Open de Esgrima — Iniciação & Amistoso.png', 'Esgrima', 16, 14, 30.00),
('Slackline Festival - Lagoa de Piratininga', '2025-11-08', '08:30', 'Gramado central da Lagoa de Piratininga', '/images/events/Slackline Festival - Lagoa de Piratininga.png', 'Slackline', 50, 35, 20.00),
('Patins Street Jam — Neves', '2025-11-16', '09:30', 'Praça do Skate em Neves', '/images/events/Patins Street Jam — Neves.png', 'Patins', 30, 22, 10.00),
('Clínica de Polo Aquático — Iniciantes', '2025-11-22', '09:30', 'Parque Aquático Santa Rosa', '/images/events/Clínica de Polo Aquático — Iniciantes.png', 'Polo Aquático', 20, 18, 40.00),
('Lacrosse Day — Amistoso Misto', '2025-11-29', '09:30', 'Campo do Clube Ponta D''Areia', '/images/events/Lacrosse Day — Amistoso Misto.png', 'Lacrosse', 24, 20, 0.00),
('Footgolf Aberto da Restinga', '2025-12-06', '08:00', 'Área de Lazer de Itaipuaçu', '/images/events/Footgolf Aberto da Restinga.png', 'Footgolf', 32, 28, 35.00);

-- =====================================================
-- VERIFICAR DADOS INSERIDOS
-- =====================================================
SELECT 'Clubes inseridos: ' || COUNT(*) FROM clubs;
SELECT 'Professores inseridos: ' || COUNT(*) FROM teachers;
SELECT 'Eventos inseridos: ' || COUNT(*) FROM events;

