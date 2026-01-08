<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once "../config/db.php";

// Récupérer l'ID de l'étudiant depuis la requête GET
$etudiantId = $_GET['id_etudiant'] ?? null;

if (!$etudiantId) {
    echo json_encode(["error" => "ID étudiant manquant"]);
    exit;
}


// Récupérer les tickets de l'étudiant
$stmt = $pdo->prepare("SELECT * FROM ticket WHERE id_etudiant = ?");
$stmt->execute([$etudiantId]);
$tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($tickets);
