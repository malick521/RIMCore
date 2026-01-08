<?php
$servername= "localhost";
$dbname = "database_rimcore";
$username = "root";
$password = "";

try {
    // Création de l'objet PDO
    $pdo = new PDO(
        "mysql:host=$servername;dbname=$dbname;charset=utf8", // DSN
        $username,                                        // Nom utilisateur
        $password,                                        // Mot de passe
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,  // Erreurs en exception
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // fetch() renvoie tableau associatif
        ]
    );
} catch (PDOException $e) {
    // En cas d'erreur de connexion
    http_response_code(500);
    echo json_encode(["message" => "Erreur de connexion à la base : " . $e->getMessage()]);
    exit;
}
