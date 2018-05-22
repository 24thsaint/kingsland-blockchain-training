pragma solidity ^0.4.21;

contract StudentRegistry {
    Student[] private students;
    address private lecturer;
    
    struct Student {
        string name;
        uint[] marks;
        address eth;
    }

    event NewStudent(string _name);

    constructor() public {
        lecturer = msg.sender;
    }

    modifier onlyLecturer() {
        require(msg.sender == lecturer);
        _;
    }

    function addStudent(string _name, uint[] _marks, address _eth) public onlyLecturer {
        students.push(Student({
            name: _name,
            marks: _marks,
            eth: _eth
        }));
        emit NewStudent(_name);
    }

    function getStudent(uint _index) view public returns (string, address) {
        return (students[_index].name, students[_index].eth);
    }

    function count() view public returns (uint) {
        return students.length;
    }

    function getGradeCount(uint _studentIndex) view public returns (uint) {
        return students[_studentIndex].marks.length;
    }

    function getGrade(uint _studentIndex, uint _gradeIndex) view public returns (uint) {
        return students[_studentIndex].marks[_gradeIndex];
    }
}