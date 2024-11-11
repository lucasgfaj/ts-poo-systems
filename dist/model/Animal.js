"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Animal {
    // Torne todos os parâmetros opcionais e defina valores padrão
    constructor(id = 0, name = "", specie = "", breed = "", gender = "") {
        this.id = id;
        this.name = name;
        this.specie = specie;
        this.breed = breed;
        this.gender = gender;
    }
    getID() {
        return this.id;
    }
    setID(id) {
        this.id = id;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getSpecie() {
        return this.specie;
    }
    setSpecie(specie) {
        this.specie = specie;
    }
    getGender() {
        return this.gender;
    }
    setGender(gender) {
        this.gender = gender;
    }
    getBreed() {
        return this.breed;
    }
    setBreed(breed) {
        this.breed = breed;
    }
}
exports.default = Animal;
