<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/db.php"; // $pdo

// Pour preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// 1️⃣ Validation
if (empty($data['numero']) || empty($data['code'])) {
    http_response_code(400);
    echo json_encode(["message" => "Tous les champs sont obligatoires"]);
    exit;
}

$numero = $data['numero'];
$code = trim($data['code']);
$id_etudiant = $data['userId']; // le userId
$montant = 5.00; // le montant
$methode = $data['method'];

// 2️⃣ Validation format
if (!preg_match('/^\d{8}$/', $numero)) {
    http_response_code(400);
    echo json_encode(["message" => "Le numéro doit contenir exactement 8 chiffres"]);
    exit;
}

if (!preg_match('/^[234]/', $numero)) {
    http_response_code(400);
    echo json_encode(["message" => "Ce numéro est incorrect !"]);
    exit;
}

if (!preg_match('/^\d{4}$/', $code)) {
    http_response_code(400);
    echo json_encode(["message" => "Le code doit contenir exactement 4 chiffres"]);
    exit;
}

try {

    // 3️⃣ Vérifier si l'étudiant a déjà un ticket valide
    $stmt = $pdo->prepare("
        SELECT * FROM ticket 
        WHERE id_etudiant = ? 
        AND statut = 'valide' 
        AND date_expiration > NOW()
    ");
    $stmt->execute([$id_etudiant]);
    $existingTicket = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingTicket) {
        http_response_code(409);
        echo json_encode(["message" => "Vous avez déjà un ticket valide jusqu'au " . $existingTicket['date_expiration']]);
        exit;
    }

    // 4️⃣ Générer un numéro de ticket unique (6 chiffres)
    do {
        $numero_ticket = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $stmt = $pdo->prepare("SELECT 1 FROM ticket WHERE numero_ticket = ?");
        $stmt->execute([$numero_ticket]);
    } while ($stmt->fetch());

    // 5️⃣ Créer le ticket
    $stmt = $pdo->prepare("
        INSERT INTO ticket (numero_ticket, id_etudiant, date_expiration, statut)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR), 'valide')
    ");
    $stmt->execute([$numero_ticket, $id_etudiant]);
    $id_ticket = $pdo->lastInsertId();

    // 6️⃣ Enregistrer le paiement
    $stmt = $pdo->prepare("
        INSERT INTO paiement (id_ticket, montant, date_paiement, moyen_paiement, statut)
        VALUES (?, ?, NOW(), ?, 'effectué')
    ");
    $stmt->execute([$id_ticket, $montant, $methode]);

    // 7️⃣ Retour frontend
    http_response_code(200);
    echo json_encode([
        "message" => "Achat réussi !",
        "numero_ticket" => $numero_ticket,
        "id_ticket" => $id_ticket,
        "montant" => $montant,
        "date_expiration" => date('Y-m-d H:i:s', strtotime('+24 hours'))
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur serveur : " . $e->getMessage()]);
    exit;
}
