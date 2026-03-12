<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once "../config/db.php";

$adminId = $_GET['id_admin'] ?? null;

if (!$adminId) { 
    echo json_encode([]);
    exit;
}

// 1️⃣ Mettre à jour les tickets expirés
$now = (new DateTime())->format('Y-m-d H:i:s');

$updateExpired = $pdo->prepare("
    UPDATE ticket
    SET statut = 'expiré'
    WHERE date_expiration < :now AND statut != 'utilisé'
");
$updateExpired->bindParam(':now', $now);
$updateExpired->execute();

// 2️⃣ Récupérer tous les tickets
$stmt = $pdo->prepare("
    SELECT id_ticket, numero_ticket, id_etudiant, id_employe, date_achat, date_expiration, statut
    FROM ticket
");
$stmt->execute();

$tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 3️⃣ Retourner JSON
echo json_encode($tickets);