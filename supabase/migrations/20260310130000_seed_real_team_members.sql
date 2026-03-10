-- ============================================================
-- Seed real IES Ingredients team members (28 members)
-- Source: ies-ingredients.com/equipe/
-- ============================================================

-- Remove fake seed data
DELETE FROM public.team_members WHERE name IN (
  'Sophie Martin', 'Pierre Dubois', 'Marie Laurent', 'Jean Moreau'
);

-- Direction
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('François-Patrick SABATER', 'Président Directeur Général', 'President & CEO', 'ies2@ies-ingredients.com', NULL, 'direction', 1, true),
('Noël POINSIGNON', 'Directeur Général', 'Managing Director', 'n.poinsignon@ies-ingredients.com', '+33 (0)6 58 46 81 40', 'direction', 2, true),
('Marion FABRE', 'Directrice Générale Adjointe', 'Deputy Managing Director', 'm.fabre@ies-ingredients.com', '+33 (0)6 03 88 56 45', 'direction', 3, true),
('Jean-Hugues LE CLAINCHE', 'Directeur Commercial Parfum & Arômes', 'Commercial Director Fragrance & Flavours', 'j.leclainche@ies-ingredients.com', '+33 (0)6 67 98 44 75', 'direction', 4, true),
('Eric BOUTON', 'Directeur Commercial Cosmétique', 'Commercial Director Cosmetics', 'e.bouton@ies-ingredients.com', '+33 (0)6 69 70 13 68', 'direction', 5, true);

-- Contacts Cosmétique
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Marjorie VAN CHINH', 'Technico-Commerciale', 'Technical Sales Representative', 'm.vanchinh@ies-ingredients.com', '+33 (0)6 59 06 27 58', 'cosmetique', 10, true),
('Héloïse RAFFIN', 'Technico-Commerciale', 'Technical Sales Representative', 'h.raffin@ies-ingredients.com', '+33 (0)6 64 28 88 60', 'cosmetique', 11, true);

-- Contacts Parfum
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Anaïs BAPTISTE', 'Technico-Commerciale', 'Technical Sales Representative', 'a.baptiste@ies-ingredients.com', '+33 (0)6 03 26 35 24', 'parfum', 20, true),
('Yasmina TEBBAL', 'Technico-Commerciale', 'Technical Sales Representative', 'y.tebbal@ies-ingredients.com', '+33 (0)7 63 88 37 52', 'parfum', 21, true);

-- Contact Arômes
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Simon GUYADER', 'Technico-Commercial', 'Technical Sales Representative', 's.guyader@ies-ingredients.com', '+33 (0)6 62 68 72 33', 'aromes', 30, true),
('Vincent TALVAS', 'Technico-Commercial', 'Technical Sales Representative', 'v.talvas@ies-ingredients.com', '+33 (0)7 63 53 30 02', 'aromes', 31, true);

-- Administration des Ventes
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Valérie CANTARDJIAN', 'Responsable Administration des ventes', 'Sales Administration Manager', 'v.milazzo@ies-ingredients.com', '+33 (0)4 91 07 70 88', 'administration-ventes', 40, true),
('Christelle ROHAN', 'Assistante Administration des ventes', 'Sales Administration Assistant', 'c.rohan@ies-ingredients.com', '+33 (0)4 91 07 70 86', 'administration-ventes', 41, true),
('Justine GAILLET', 'Assistante Administration des ventes', 'Sales Administration Assistant', 'j.gaillet@ies-ingredients.com', '+33 (0)4 13 94 00 01', 'administration-ventes', 42, true),
('Claire DELERIS', 'Assistante Administration des ventes', 'Sales Administration Assistant', 'c.deleris@ies-ingredients.com', NULL, 'administration-ventes', 43, true);

-- Affaires Réglementaires
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Magali AGNELLO', 'Responsable Affaires Réglementaires & Qualité', 'Regulatory Affairs & Quality Manager', 'm.agnello@ies-ingredients.com', '+33 (0)4 91 07 83 08', 'affaires-reglementaires', 50, true),
('Léa LABELLE', 'Chargée Affaires Réglementaires & Qualité', 'Regulatory Affairs & Quality Officer', 'l.labelle@ies-ingredients.com', '+33 (0)4 91 07 70 78', 'affaires-reglementaires', 51, true),
('Olivia DESVIGNES', 'Chargée Affaires Réglementaires & Qualité', 'Regulatory Affairs & Quality Officer', 'o.desvignes@ies-ingredients.com', '+33 (0)4 91 07 77 91', 'affaires-reglementaires', 52, true),
('Solène BELLOT', 'Assistante Affaires Réglementaires et Qualité', 'Regulatory Affairs & Quality Assistant', 's.bellot@ies-ingredients.com', NULL, 'affaires-reglementaires', 53, true);

-- Marketing & Communication
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Cindy SANGNIER', 'Responsable Marketing & Communication', 'Marketing & Communication Manager', 'c.sangnier@ies-ingredients.com', '+33 7 82 55 96 09', 'marketing-communication', 60, true),
('Anaïs LOUNI', 'Assistante Marketing & Communication', 'Marketing & Communication Assistant', 'a.louni@ies-ingredients.com', '+33 4 91 07 70 87', 'marketing-communication', 61, true),
('Carla RIZZI', 'Assistante Marketing & Communication', 'Marketing & Communication Assistant', 'c.rizzi@ies-ingredients.com', '+33 7 69 53 81 54', 'marketing-communication', 62, true);

-- Logistique
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Nicolas GAGLIARDO', 'Responsable Logistique', 'Logistics Manager', 'n.gagliardo@ies-ingredients.com', '+33 (0)4 91 07 73 47', 'logistique', 70, true);

-- Achats
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Léa SUKAR', 'Approvisionneuse', 'Purchasing Officer', 'l.sukar@ies-ingredients.com', '+33 (0)4 91 07 83 05', 'achats', 80, true);

-- Laboratoires
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Valentine FANUCCI', 'Chargée du laboratoire d''applications', 'Applications Laboratory Officer', 'v.fanucci@ies-ingredients.com', '+33 (0)4 91 07 73 45', 'laboratoires', 90, true),
('Elise LE ROUX', 'Chargée du laboratoire extraits végétaux', 'Plant Extracts Laboratory Officer', 'e.leroux@ies-ingredients.com', NULL, 'laboratoires', 91, true);

-- RSE
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Christophe MANGALTE', 'Responsable RSE', 'CSR Manager', 'christophe.mangalte@ies-ingredients.com', NULL, 'rse', 100, true);

-- Ressources Humaines
INSERT INTO public.team_members (name, role_fr, role_en, email, phone, department, display_order, is_active) VALUES
('Marie-Laure CHATELLIER', 'Responsable RH', 'HR Manager', 'recrutement@ies-ingredients.com', NULL, 'ressources-humaines', 110, true);
