<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/db.php";

$EmpId = $_GET['id_employe'] ?? null;

if (!$EmpId) { 
    echo json_encode([]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// récupérer JSON envoyé
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['numero_ticket'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Numéro de ticket manquant"
    ]);
    exit;
}

$numero_ticket = $input['numero_ticket'];

// chercher le ticket
$stmt = $pdo->prepare("
    SELECT * FROM ticket
    WHERE numero_ticket = :numero_ticket
    LIMIT 1
");
$stmt->bindParam(':numero_ticket', $numero_ticket);
$stmt->execute();

$ticket = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$ticket) {
    echo json_encode([
        "success" => false,
        "message" => "Ticket introuvable"
    ]);
    exit;
}

// vérifier expiration
$now = new DateTime();
$expiration = new DateTime($ticket['date_expiration']);

if ($expiration < $now) {
    echo json_encode([
        "success" => false,
        "message" => "Ticket expiré"
    ]);
    exit;
}

// vérifier statut
if ($ticket['statut'] === "utilisé") {
    http_response_code(400);
    echo json_encode(["message" => "Ticket utilisé"]);
    exit;
}


// mettre statut utilisé
$update = $pdo->prepare("
    UPDATE ticket
    SET statut = 'utilisé'
    WHERE id_ticket = :id_ticket
");

$update->bindParam(':id_ticket', $ticket['id_ticket']);
$update->bindParam(':id_employe', $EmpId);
$update->execute();

// réponse
echo json_encode([
    "success" => true,
    "message" => "Ticket valide",
    "ticket" => [
        "id_ticket" => $ticket['id_ticket'],
        "numero_ticket" => $ticket['numero_ticket'],
        "id_etudiant" => $ticket['id_etudiant'],
        "date_achat" => $ticket['date_achat'],
        "id_employe" => $EmpId,
        "date_expiration" => $ticket['date_expiration'],
        "statut" => "utilisé"
    ]
]);