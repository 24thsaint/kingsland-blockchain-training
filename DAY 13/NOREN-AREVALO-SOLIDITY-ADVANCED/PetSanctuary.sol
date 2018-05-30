pragma solidity ^0.4.21;

contract PetSanctuary {
    address private ownerAddress;
    mapping (bytes32 => uint) public animals;
    mapping (bytes32 => bool) public acceptedAnimals;
    mapping (address => Person) public adoptionRegistry;
    
    event NewAnimal(string _animalKind, bytes32 _animalKindHash, uint count);
    event AnimalAdopted(address _newOwner, string _animalKind, bytes32 _animalKindHash, uint count);
    event AnimalReturned(address _oldOwner, string _animalKind, bytes32 _animalKindHash, uint count);
    
    constructor() public {
        acceptedAnimals[keccak256("FISH")] = true;
        acceptedAnimals[keccak256("CAT")] = true;
        acceptedAnimals[keccak256("DOG")] = true;
        acceptedAnimals[keccak256("RABBIT")] = true;
        acceptedAnimals[keccak256("PARROT")] = true;
        ownerAddress = msg.sender;
    }
    
    struct Person {
        uint age;
        uint gender; // FEMALE = 0; MALE = 1
        bytes32 adoptedAnimal;
        uint adoptionTimestamp;
        bool hasAdoptedAnAnimal;
    }
    
    modifier onlyOwner() {
        require(msg.sender == ownerAddress);
        _;
    }
    
    modifier checkExpiration() {
        require(block.timestamp < adoptionRegistry[msg.sender].adoptionTimestamp + 10 seconds);
        _;
    }
    
    modifier isAnimalAccepted(string _animalKind) {
        bytes32 animalKind = keccak256(abi.encodePacked(_animalKind));
        require(acceptedAnimals[animalKind] == true);
        _;
    }
    
    function add(string _animalKind, uint _howManyPieces) public onlyOwner isAnimalAccepted(_animalKind) {
        bytes32 animalKind = keccak256(abi.encodePacked(_animalKind));
        require(animals[animalKind] + 1 > animals[animalKind]);
        animals[animalKind] += _howManyPieces;
        emit NewAnimal(_animalKind, animalKind, animals[animalKind]);
    }
    
    function buy(uint _personAge, uint _personGender, string _animalKind) public isAnimalAccepted(_animalKind) {
        bytes32 animalKind = keccak256(abi.encodePacked(_animalKind));
        require(animals[animalKind] > 0);
        require(_personGender == 0 || _personGender == 1);
        
        require(adoptionRegistry[msg.sender].hasAdoptedAnAnimal == false);
        if (_personGender == 1) {
            require(animalKind == keccak256("FISH") || animalKind == keccak256("DOG"));    
        } else if (_personGender == 0) {
            if (_personAge < 40) {
                require(animalKind != keccak256("CAT"));        
            }
        } else {
            revert();
        }
        
        adoptionRegistry[msg.sender] = Person(_personAge, _personGender, animalKind, block.timestamp, true);
        animals[animalKind] -= 1;
        emit AnimalAdopted(msg.sender, _animalKind, animalKind, animals[animalKind]);
    }
    
    function giveBackAnimal(string _animalKind) public checkExpiration isAnimalAccepted(_animalKind) {
        bytes32 animalKind = keccak256(abi.encodePacked(_animalKind));
        require(adoptionRegistry[msg.sender].adoptedAnimal == animalKind);
        require(animals[animalKind] + 1 > animals[animalKind]);
        
        adoptionRegistry[msg.sender].hasAdoptedAnAnimal = false;
        adoptionRegistry[msg.sender].adoptedAnimal = 0x0;
        animals[animalKind] += 1;
        emit AnimalReturned(msg.sender, _animalKind, animalKind, animals[animalKind]);
    }
    
}