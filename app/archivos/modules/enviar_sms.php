<?php
if (! defined ( 'CAO_SYSTEMS' )) {
	die ( "Error| Asi no se entra a este archivo" );
}
    $n = '+'.$_REQUEST['n'];
    $t = $_REQUEST['t'];
	require_once ENGINE_DIR . '/modules/Twilio/autoload.php';

	use Twilio\Rest\Client;

	$sid = 'AC076cef6ec0a0538c1e4361fd568e45b5';
    $token = '5d413ae7797b87a67981e1ac182e7988';
    $client = new Client($sid, $token);

    $client->messages->create($n, array('from' => '+12058288223','body' => $t));

    $accion = $message->sid;
    $accion = $_GET['callback'].'('.json_encode($accion).')';
    
    $tpl->result['main'] = utf8_encode($accion);
    echo $tpl->result['main'];
    die ();
?>