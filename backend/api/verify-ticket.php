<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once "../config/db.php";

// Récupérer les données JSON envoyées
$input = json_decode(file_get_contents("php://input"), true);

// Vérifier que le numero_ticket et id_etudiant sont présents
if (!isset($input['numero_ticket']) || !isset($input['id_etudiant'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Numéro de ticket ou ID étudiant manquant']);
    exit;
}

$numero_ticket = $input['numero_ticket'];
$id_etudiant = $input['id_etudiant'];

// Préparer la requête sécurisée
$stmt = $pdo->prepare("
    SELECT id_ticket, numero_ticket, id_etudiant, id_employe, date_achat, date_expiration, statut
    FROM tickets
    WHERE numero_ticket = :numero_ticket AND id_etudiant = :id_etudiant
    LIMIT 1
");
$stmt->bindParam(':numero_ticket', $numero_ticket);
$stmt->bindParam(':id_etudiant', $id_etudiant);
$stmt->execute();

$ticket = $stmt->fetch(PDO::FETCH_ASSOC);

if ($ticket) {
    // Vérifier si le ticket est expiré
    $now = new DateTime();
    $expiration = new DateTime($ticket['date_expiration']);
    if ($expiration < $now) {
        $ticket['statut'] = 'expiré';
    }

    echo json_encode([
        'success' => true,
        'ticket' => $ticket,
        'message' => 'Ticket vérifié avec succès'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Ticket invalide ou introuvable'
    ]);
}