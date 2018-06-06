pragma solidity ^0.4.18;
 
contract Voting {
 
    mapping (bytes32 => uint8) public votesReceived;
 
    string[] public candidateList;
 
    function addCandidate(string candidateNames) public {
        candidateList.push(candidateNames);
    }
 
    function totalVotesFor(string candidate) view public returns (uint8) {
        require(validCandidate(candidate));
        return votesReceived[keccak256(candidate)];
    }
    
    function voteForCandidate(string candidate) public {
        require(validCandidate(candidate));
        votesReceived[keccak256(candidate)] += 1;
    }
    
    function validCandidate(string candidate) view public returns (bool) {
        for(uint i = 0; i < candidateList.length; i++) {
            if (keccak256(candidateList[i]) == keccak256(candidate)) {
                return true;
            }
        }
        return false;
    }
}