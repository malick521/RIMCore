<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once "../config/db.php";

$EmpId = $_GET['id_employe'] ?? null;

if (!$EmpId) { 
    echo json_encode([]);
    exit;
}

// Récupérer les tickets validés par cet employé
$stmt = $pdo->prepare("
    SELECT id_ticket, numero_ticket, id_etudiant, id_employe, date_achat, date_expiration, statut
    FROM ticket
    WHERE id_employe = ?
");
$stmt->execute([$EmpId]);

$tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Retourner JSON
echo json_encode($tickets);