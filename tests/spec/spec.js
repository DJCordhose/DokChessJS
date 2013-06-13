"use strict";

describe("Schachbrett", function() {

    it("Farbe", function() {
        expect(Farbe.andere(Farbe.WEISS)).toEqual(Farbe.SCHWARZ);
        expect(Farbe.alsBuchstabe(Farbe.WEISS)).toEqual('w');
     });
});