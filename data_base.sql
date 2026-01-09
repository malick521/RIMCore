-- La TABLE Etudiant : 

CREATE TABLE Etudiant (
    id_etudiant INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nni CHAR(14) UNIQUE, 
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255),
    role varchar(20) default 'etudiant',
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- La TABLE Employe :  

CREATE TABLE Employe (
    id_employe INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(100),
    mot_de_passe VARCHAR(255),
    role varchar(20) default 'employe',
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- La TABLE Administrateur : 

CREATE TABLE Administrateur (
    id_admin INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(100),
    mot_de_passe VARCHAR(255),
    role varchar(20) default 'admin',
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Ticket
CREATE TABLE Ticket (
    id_ticket INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    numero_ticket CHAR(6) NOT NULL UNIQUE,       -- ajouté pour correspondre au code
    id_etudiant INT NOT NULL,
    id_employe INT DEFAULT NULL,
    date_achat DATETIME DEFAULT NOW(),
    date_expiration DATETIME NOT NULL,          -- ajouté pour correspondre au code
    statut VARCHAR(20) DEFAULT 'Non utilisé',
    FOREIGN KEY (id_etudiant) REFERENCES Etudiant(id_etudiant),
    FOREIGN KEY (id_employe) REFERENCES Employe(id_employe)
);

-- Table Paiement
CREATE TABLE Paiement (
    id_transaction INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    id_ticket INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    date_paiement DATETIME DEFAULT NOW(),
    moyen_paiement VARCHAR(50) NOT NULL, -- Marsvi, Bankily, etc.
    statut VARCHAR(20) DEFAULT 'En attente',
    FOREIGN KEY (id_ticket) REFERENCES Ticket(id_ticket)
);
