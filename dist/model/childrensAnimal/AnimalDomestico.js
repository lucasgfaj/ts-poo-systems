"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Animal_1 = __importDefault(require("../Animal"));
class AnimalDomestico extends Animal_1.default {
    constructor(id, name, specie, breed, gender, petShop, owner) {
        super(id, name, specie, breed, gender);
        this.petShop = petShop;
        this.owner = owner;
    }
    getPetShop() {
        return this.petShop;
    }
    setPetShop(petShop) {
        this.petShop = petShop;
    }
    getOwner() {
        return this.owner;
    }
    setOwner(onwer) {
        this.owner = onwer;
    }
}
exports.default = AnimalDomestico;
