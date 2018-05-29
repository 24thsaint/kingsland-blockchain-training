pragma solidity ^0.4.21;

contract Capitol {
    uint private startDate;
    uint private endDate;
    
    uint public boyTribute;
    uint public girlTribute;
    
    struct Person {
        uint age;
        uint gender;    // Female: 0, Male: 1
        uint isAlive;   // Dead: 0, Alive: 1
    }
    
    Person[] private people;
    
    function addPerson(uint _age, uint _gender) public {
        require(_gender == 0 || _gender == 1);
        people.push(Person({
            age: _age,
            gender: _gender,
            isAlive: 1
        }));
    }
    
    function getPeopleCount() view public returns (uint) {
        return people.length;
    }
    
    function chooseTribute() public returns (uint, uint) {
        uint girlIndex = generateRandom();
        uint boyIndex = generateRandom();
        
        while (people[girlIndex].gender != 0 || people[boyIndex].gender != 1) {
            if (people[girlIndex].gender != 0) {
                girlIndex += 1;
                girlIndex = girlIndex % people.length;
            }
            
            if (people[girlIndex].gender == 0 && (people[girlIndex].age < 12 || people[girlIndex].age > 18)) {
                girlIndex += 1;
                girlIndex = girlIndex % people.length;
            }
            
            if (people[boyIndex].gender != 1) {
                boyIndex += 1;
                boyIndex = boyIndex % people.length;
            }
            
            if (people[boyIndex].gender == 0 && (people[boyIndex].age < 12 || people[boyIndex].age > 18)) {
                boyIndex += 1;
                boyIndex = boyIndex % people.length;
            }
            
            // No tribute found
            require(girlIndex < people.length * 2 || boyIndex < people.length * 2);
        }
        
        startDate = block.timestamp;
        endDate = block.timestamp + 5 minutes;
        boyTribute = boyIndex;
        girlTribute = girlIndex;
        
        return (boyIndex, girlIndex);
    }
    
    modifier gameNotOver() {
        require(endDate > block.timestamp);
        _;
    }
    
    function isAlive() public gameNotOver returns (uint, uint) {
        uint random = generateRandom();
        if (random > people.length / 2 && people[boyTribute].isAlive == 1) {
            people[boyTribute].isAlive = 0;
        }
        
        if (random < people.length / 2 && people[girlTribute].isAlive == 1) {
            people[girlTribute].isAlive = 0;
        }
        
        return (people[boyTribute].isAlive, people[girlTribute].isAlive);
    }
    
    function getTributeAtIndex(uint _index) view public returns (uint, uint, uint) {
        return (people[_index].age, people[_index].gender, people[_index].isAlive);
    }
    
    function generateRandom() view private returns (uint) {
        uint seed = block.timestamp + block.number;
        return seed % people.length;
    }
}