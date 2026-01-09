<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../config/db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["message" => "Tous les champs sont obligatoires"]);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Email invalide"]);
    exit;
}

// etudiant :

$stmt = $pdo->prepare("SELECT id_etudiant, nom, prenom, mot_de_passe, email, role FROM etudiant WHERE email = ?");
$stmt->execute([$email]);
$etudiant = $stmt->fetch(PDO::FETCH_ASSOC);

// admin :
$stmt = $pdo->prepare("SELECT id_admin, nom, prenom, mot_de_passe, email, role FROM administrateur WHERE email = ?");
$stmt->execute([$email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

// employe :
$stmt = $pdo->prepare("SELECT id_employe, nom, prenom, mot_de_passe, email, role FROM employe WHERE email = ?");
$stmt->execute([$email]);
$employe = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$etudiant && !$admin && !$employe) {
    http_response_code(404);
    echo json_encode(["message" => "Email inexistant"]);
    exit;
}


if($etudiant){
    
if (!password_verify($password, $etudiant['mot_de_passe'])) {
    http_response_code(401);
    echo json_encode(["message" => "Mot de passe incorrect"]);
    exit;
}

else{
    http_response_code(200);
    echo json_encode([
    "message" => "Connexion réussi",
    "id_etudiant" => $etudiant['id_etudiant'],
    "nom" => $etudiant['nom'],
    "prenom" => $etudiant['prenom'],
    "email" => $etudiant['email'],
    "role" => $etudiant['role']
]);
}
  exit; 
}


if($employe){
  
if (!password_verify($password, $employe['mot_de_passe'])) {
    http_response_code(401);
    echo json_encode(["message" => "Mot de passe incorrect"]);
    exit;
}
else{
    
    http_response_code(200);
    echo json_encode([
    "message" => "Connexion réussie",
    "id_employe" => $employe['id_employe'],
    "nom" => $employe['nom'],
    "prenom" => $employe['prenom'],
    "email" => $employe['email'],
    "role" => $employe['role']
]);
}
  exit; 
}



if($admin){

if (!password_verify($password, $admin['mot_de_passe'])) {
    http_response_code(401);
    echo json_encode(["message" => "Mot de passe incorrect"]);
    exit;
}
else{
    
http_response_code(200);
echo json_encode([
    "message" => "Connexion réussie",
    "id_admin" => $admin['id_admin'],
    "nom" => $admin['nom'],
    "prenom" => $admin['prenom'],
    "email" => $admin['email'],
    "role" => $admin['role']
]);
}
  exit; 
}



