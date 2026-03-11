<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../config/db.php"; 

// Répondre aux requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "ID manquant"]);
    exit;
}

$id = intval($input['id']);

$sql = "DELETE FROM employe WHERE id_employe = ?";
$stmt = $pdo->prepare($sql);
if ($stmt->execute([$id])) {
    echo json_encode(["message" => "Employé supprimé avec succès"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de la suppression"]);
}

