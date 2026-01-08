<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../config/db.php"; 

// Pour gérer les requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// $pdo : connexion PDO


// Récupérer le JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validation basique des champs
if (
    empty($data['prenom']) ||
    empty($data['nom']) ||
    empty($data['email']) ||
    empty($data['password'])
) {
    http_response_code(400);
    echo json_encode(["message" => "Tous les champs sont obligatoires"]);
    exit;
}

$prenom = trim($data['prenom']);
$nom = trim($data['nom']);
$email = trim($data['email']);
$password = $data['password'];

// Validation email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Email invalide"]);
    exit;
}

// Vérifier que le email existe dans la table
$stmt = $pdo->prepare("SELECT id_employe, nom, prenom, email, mot_de_passe FROM employe WHERE email = ?");
$stmt->execute([$email]);
$employe = $stmt->fetch(PDO::FETCH_ASSOC);

if ($employe) {
    http_response_code(404);
    echo json_encode(["message" => "Cette adresse e-mail est déjà utilisé !"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id_admin, nom, prenom, email, mot_de_passe FROM administrateur WHERE email = ?");
$stmt->execute([$email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if ($admin) {
    http_response_code(404);
    echo json_encode(["message" => "Cette adresse e-mail est déjà utilisé !"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id_etudiant, nom, prenom, email, mot_de_passe FROM etdiant WHERE email = ?");
$stmt->execute([$email]);
$etudiant = $stmt->fetch(PDO::FETCH_ASSOC);

if ($etudiant) {
    http_response_code(404);
    echo json_encode(["message" => "Cette adresse e-mail est déjà utilisé !"]);
    exit;
}



// Hash du mot de passe
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Mise à jour
try {
    $stmt = $pdo->prepare("
       INSERT INTO employe(nom, prenom, email, mot_de_passe)
        values(?,?,?,?)
    ");
    $stmt->execute([$nom, $prenom, $email, $hashedPassword]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur serveur : " . $e->getMessage()]);
    exit;
}

// Succès
http_response_code(200);
echo json_encode(["message" => "Inscription réussie"]);
