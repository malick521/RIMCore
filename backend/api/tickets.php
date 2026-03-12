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

$now = (new DateTime())->format('Y-m-d H:i:s');

$updateExpired = $pdo->prepare("
    UPDATE ticket
    SET statut = 'expiré'
    WHERE id_etudiant = :id_etudiant 
      AND date_expiration < :now
      AND statut != 'utilisé'
");
$updateExpired->bindParam(':id_etudiant', $etudiantId);
$updateExpired->bindParam(':now', $now);
$updateExpired->execute();


$stmt = $pdo->prepare("SELECT * FROM ticket WHERE id_etudiant = ?");
$stmt->execute([$etudiantId]);
$tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($tickets);