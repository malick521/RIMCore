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
    SELECT id_employe, nom, prenom, role, date_ajout
    FROM employe
");
$stmt->execute();

$employes = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($employes);
