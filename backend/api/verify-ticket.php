<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/db.php";

// Gestion des requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Vérifier que la requête est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée"
    ]);
    exit;
}

// Récupérer le JSON envoyé
$input = json_decode(file_get_contents("php://input"), true);

// Vérifier que les informations nécessaires sont présentes
$numero_ticket = $input['numero_ticket'] ?? null;
$EmpId = $input['id_employe'] ?? null;

if (!$numero_ticket || !$EmpId) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Informations manquantes"
    ]);
    exit;
}

// Chercher le ticket
$stmt = $pdo->prepare("
    SELECT * FROM ticket
    WHERE numero_ticket = :numero_ticket
    LIMIT 1
");
$stmt->bindParam(':numero_ticket', $numero_ticket);
$stmt->execute();

$ticket = $stmt->fetch(PDO::FETCH_ASSOC);

// Vérifier que le ticket existe
if (!$ticket) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Ticket introuvable"
    ]);
    exit;
}

// Vérifier expiration
$now = new DateTime();
$expiration = new DateTime($ticket['date_expiration']);
if ($expiration < $now) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Ticket expiré"
    ]);
    exit;
}

// Vérifier si déjà utilisé
if ($ticket['statut'] === "utilisé") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Ticket déjà utilisé"
    ]);
    exit;
}

// Mettre à jour le ticket (statut + employé)
$update = $pdo->prepare("
    UPDATE ticket
    SET statut = 'utilisé', id_employe = :id_employe
    WHERE id_ticket = :id_ticket
");
$update->bindParam(':id_ticket', $ticket['id_ticket']);
$update->bindParam(':id_employe', $EmpId);
$update->execute();

// Réponse JSON
echo json_encode([
    "success" => true,
    "message" => "Ticket validé",
    "ticket" => [
        "id_ticket" => $ticket['id_ticket'],
        "numero_ticket" => $ticket['numero_ticket'],
        "id_etudiant" => $ticket['id_etudiant'],
        "id_employe" => $EmpId,
        "date_achat" => $ticket['date_achat'],
        "date_expiration" => $ticket['date_expiration'],
        "statut" => "utilisé"
    ]
]);