-- =====================================================
-- POPULAR BANCO DE DADOS COM DADOS JSON
-- =====================================================

-- Este script popula o banco de dados com os dados dos arquivos JSON
-- Execute este script no SQL Editor do Supabase após criar o schema

-- =====================================================
-- LIMPAR DADOS EXISTENTES (CUIDADO EM PRODUÇÃO!)
-- =====================================================

DELETE FROM events;
DELETE FROM teachers;
DELETE FROM clubs;

-- =====================================================
-- CLUBES
-- =====================================================

INSERT INTO clubs (name, distance_km, sports, image_url) VALUES
('Centro Horizonte', 9, ARRAY['Goalball', 'Bocha paralímpica'], '/images/clubs/Centro Horizonte.png'),
('Boulder Lab', 11, ARRAY['Escalada indoor', 'Slackline'], '/images/clubs/Boulder Lab.png'),
('KinBall & Floorball Hub', 4, ARRAY['Kin-Ball', 'Floorball'], '/images/clubs/KinBall & Floorball Hub.png'),
('Campo Verde Footgolf', 28, ARRAY['Footgolf', 'Ultimate Frisbee'], '/images/clubs/Campo Verde Footgolf.png'),
('Biribol & Natação Adaptada São Francisco', 15, ARRAY['Biribol', 'Natação Adaptada'], '/images/clubs/Biribol & Natação Adaptada São Francisco.png'),
('Tamboréu Praia Clube', 16, ARRAY['Tamboréu', 'Beach Ultimate'], '/images/clubs/Tamboréu Praia Clube.png'),
('Hangar 101', 24, ARRAY['Corrida de Drone'], '/images/clubs/Hangar 101.png');

-- =====================================================
-- PROFESSORES
-- =====================================================

INSERT INTO teachers (name, sport, rating, total_reviews, location, avatar_url, price_per_hour) VALUES
('Victor Nascimento', 'Tamboréu', 4.9, 127, 'Praia de Charitas', '/images/teachers/profile Victor Nascimento.png', 150.00),
('Helena Moraes', 'Esgrima', 4.7, 98, 'Sala de Esgrima São Domingos', '/images/teachers/profile Helena Moraes.png', 130.00),
('Lucas Prado', 'Escalada', 4.4, 65, 'Escadarias do Ingá', '/images/teachers/profile Lucas Prado.png', 120.00),
('Ana Bechara', 'Corrida', 4.6, 89, 'Orla da Boa Viagem', '/images/teachers/profile Ana Bechara.png', 110.00),
('Mateus Furlan', 'Natação', 4.5, 76, 'Complexo Aquático Pendotiba', '/images/teachers/profile Mateus Furlan.png', 140.00),
('Clarice Neri', 'Beach Tennis', 4.8, 112, 'Arena de Squash Santa Rosa', '/images/teachers/profile Clarice Neri.png', 160.00),
('Rogério Saito', 'Cross Fit', 4.3, 54, 'Centro de Treino Várzea das Moças', '/images/teachers/profile Rogério Saito.png', 125.00),
('Naomi Tanaka', 'Tênis de Mesa', 4.9, 134, 'Ginásio São Domingos', '/images/teachers/profile Naomi Tanaka.png', 145.00),
('Gabriel Mitter', 'Futebol', 4.2, 43, 'Campo Caio Martins', '/images/teachers/profile Gabriel Mitter.png', 100.00),
('Yara Potiguara', 'Ginástica Rítmica', 4.5, 71, 'Área Verde Maria Paula', '/images/teachers/profile Yara Potiguara.png', 135.00),
('Bruno Dantas', 'Escalada', 4.6, 82, 'Climb House Pendotiba', '/images/teachers/profile Bruno Dantas.png', 155.00');

-- =====================================================
-- EVENTOS
-- =====================================================

INSERT INTO events (title, date, time, location, image_url, sport, max_participants, current_participants, price) VALUES
('Trilha de Orientação Camboinhas', '2025-10-14', '08:30:00', 'Parque Estadual da Serra da Tiririca (acesso Camboinhas)', '/images/events/Trilha de Orientação Camboinhas.png', 'Orientação', 30, 18, 40.00),
('Night Parkour Meetup', '2025-10-09', '19:00:00', 'Esplanada do Caminho Niemeyer', '/images/events/Night Parkour Meetup.png', 'Parkour', 25, 20, 0.00),
('Korfebol Aberto da Baía', '2025-10-18', '09:00:00', 'Quadra Poliesportiva São Lourenço', '/images/events/Korfebol Aberto da Baía.png', 'Korfebol', 40, 32, 30.00),
('Circuito Inclusivo - Bocha na Praça', '2025-10-25', '15:00:00', 'Praça Estephânia de Carvalho', '/images/events/Circuito Inclusivo - Bocha na Praça.png', 'Bocha', 50, 15, 0.00),
('Open de Esgrima — Iniciação & Amistoso', '2025-11-01', '20:00:00', 'Sala de Esgrima São Domingos', '/images/events/Open de Esgrima — Iniciação & Amistoso.png', 'Esgrima', 20, 16, 50.00),
('Slackline Festival - Lagoa de Piratininga', '2025-11-08', '08:30:00', 'Gramado central da Lagoa de Piratininga', '/images/events/Slackline Festival - Lagoa de Piratininga.png', 'Slackline', 35, 28, 25.00),
('Patins Street Jam — Neves', '2025-11-16', '09:30:00', 'Praça do Skate em Neves', '/images/events/Patins Street Jam — Neves.png', 'Patins', 30, 22, 0.00),
('Clínica de Polo Aquático — Iniciantes', '2025-11-22', '09:30:00', 'Parque Aquático Santa Rosa', '/images/events/Clínica de Polo Aquático — Iniciantes.png', 'Polo Aquático', 15, 12, 60.00),
('Lacrosse Day — Amistoso Misto', '2025-11-29', '09:30:00', 'Campo do Clube Ponta D''Areia', '/images/events/Lacrosse Day — Amistoso Misto.png', 'Lacrosse', 25, 19, 35.00),
('Footgolf Aberto da Restinga', '2025-12-06', '08:00:00', 'Área de Lazer de Itaipuaçu', '/images/events/Footgolf Aberto da Restinga.png', 'Footgolf', 40, 30, 45.00);

-- =====================================================
-- VERIFICAR DADOS INSERIDOS
-- =====================================================

-- Ver clubes inseridos
SELECT COUNT(*) as total_clubes FROM clubs;

-- Ver professores inseridos
SELECT COUNT(*) as total_professores FROM teachers;

-- Ver eventos inseridos
SELECT COUNT(*) as total_eventos FROM events;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE clubs IS 'Clubes e centros de treinamento populados a partir de clubData.json';
COMMENT ON TABLE teachers IS 'Professores e instrutores populados a partir de teacherData.json';
COMMENT ON TABLE events IS 'Eventos esportivos populados a partir de eventData.json';

