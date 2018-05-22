const StudentRegistry = artifacts.require("./StudentRegistry.sol");

const getGrades = async function(registry, studentIndex) {
    const count = await registry.getGradeCount(studentIndex);
    const grades = [];
    for (let index = 0; index < count; index++) {
        const grade = await registry.getGrade(studentIndex, index);
        grades.push(grade);
    }
    console.log("Grades: ", grades);
}

const runCommand = async function() {
    const studentRegistry = await StudentRegistry.deployed();
    await studentRegistry.addStudent("Rave", [11,22,33], 0x00123123);
    const student = await studentRegistry.getStudent(0);
    await getGrades(studentRegistry, 0);
}

module.exports = runCommand;