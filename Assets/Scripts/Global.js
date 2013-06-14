static var deltaTime:float;
static var fixedTime:float;
static var gravity:float;
static var healthMain:float = 100;

function Start () {
    gravity = 1;
}

function Update () {
    deltaTime = Time.deltaTime;
    fixedTime = Time.fixedTime;
}