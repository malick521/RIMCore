<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once "../config/db.php";

$adminId = $_GET['id_admin'] ?? null;


if (!$adminId) { 
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT id_transaction, id_ticket, montant, date_paiement, moyen_paiement, statut
    FROM paiement
");
$stmt->execute();

$paiements = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($paiements );
