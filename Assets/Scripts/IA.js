var speed:int;

private var controller:CharacterController;
private var moveDirection:Vector3;
private var delayRotation:float;
private var changeRotation:float;
private var newRotation:float;
private var hit:RaycastHit;
private var dirToMain:Vector3;
private var fight:boolean;

function Start () {
    
    newRotation = Random.Range(1,6);
    delayRotation = Random.Range(-360,361);
    controller = GetComponent("CharacterController");
}

function Update () {
    
    //Direction vers le personnage
    dirToMain = GameObject.Find("Personnage").transform.position - transform.position;
    dirToMain.y = 0;
   
   if(!fight){
   if(dirToMain.magnitude < 6){
        
        //Suivre le vecteur dirToMain, qui va de l'ennemi au personnage.
        moveDirection = dirToMain * 0.5;
        transform.rotation = Quaternion.Slerp(transform.rotation,Quaternion.LookRotation(dirToMain),10 * Global.deltaTime);
        
   }else{
    //MOUVEMENT AUTONOME
    
    //Passer sur l'axe local
    moveDirection = Vector3.forward * speed;
   
    
    
    //Changer l'angle de rotation
    if(changeRotation + delayRotation < Global.fixedTime){
        newRotation = Random.Range(-360,361);
        changeRotation = Global.fixedTime;
        delayRotation = Random.Range(1,6);
    }
    
    
    //Changer l'angle de rotation si le Raycast entre en collision avec un objet
    if(Physics.Raycast(transform.Find("origin").position, transform.forward,hit)){
        if(hit.distance < 5){
            transform.rotation = Quaternion.Slerp(transform.rotation,transform.rotation * Quaternion.Euler(0,180,0),0.5 * Global.deltaTime);
        }else{
            transform.rotation = Quaternion.Slerp(transform.rotation,Quaternion.Euler(0,newRotation,0),0.5 * Global.deltaTime);
        }
    }
   }
    
    
    
    
    
    
    
    //Transformation locale
    
     moveDirection = transform.TransformDirection(moveDirection);
}

//FIGHT
    if(dirToMain.magnitude < 1.5){
        fight = true;
        
        //On se stop !
        moveDirection = Vector3.zero; //= Vector3(0,0,0)
        //Mais on continue de regarder dans la direction du personnage
        transform.rotation = Quaternion.Slerp(transform.rotation,Quaternion.LookRotation(dirToMain),10 * Global.deltaTime);
        }else{
        fight = false;
    }
    
    //Animations
    if(fight){
    transform.Find("skeletonDark").animation.CrossFade("attack", 0.5 * Global.deltaTime);
    }else{
    transform.Find("skeletonDark").animation.CrossFade("run", 0.5 * Global.deltaTime);
    
    }
    //Afficher le Raycast dans la test box, de couleur rouge
    Debug.DrawRay(transform.Find("origin").position,transform.forward,Color.red,1);
    
    //DŽplacement de l'ennemi
    moveDirection.y -= Global.gravity;
    controller.Move(moveDirection * Global.deltaTime);
}

//Si collision, le squelette part dans la direction opposŽe
function OnControllerColliderHit(hit:ControllerColliderHit){
        if(hit.transform.name != "terrain"){
            transform.rotation = Quaternion.Slerp(transform.rotation,transform.rotation * Quaternion.Euler(0,180,0),0.5 * Global.deltaTime);
        }
    
}