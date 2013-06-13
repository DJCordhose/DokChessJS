/**
 * Created with JetBrains WebStorm.
 * User: StefanZ
 * Date: 10.06.13
 * Time: 22:10
 * To change this template use File | Settings | File Templates.
 */

// TODO Super
"use strict";

// TODO Auch super: Hier keine technische Abhängigkeit, sondern "Business-Logik" technikfrei weggekapselt

// TODO Man kann JsDoc-Kommentare mit Tags und Typen versehen
// TODO Auch WebStorm versteht das
// TODO https://code.google.com/p/jsdoc-toolkit/wiki/TagReference
// TODO https://developers.google.com/closure/compiler/docs/js-for-compiler?hl=de

/**
 * @enum {number}
 */
var Farbe = {

    WEISS: 0,
    SCHWARZ: 1,

    /**
     * Liefert die jeweils andere Farbe zurueck
     *
     * @param {Farbe} f
     * @returns {Farbe}
     * @static
     */
    andere: function (f) {
        return f === Farbe.WEISS ? Farbe.SCHWARZ : Farbe.WEISS;
    },

    /**
     *
     * @param {Farbe} f
     * @returns {string}
     * @static
     */
    alsBuchstabe: function (f) {
        return f === Farbe.WEISS ? 'w' : 'b';
    }
};

/**
 * @enum {number}
 */
var FigurenArt = {
    BAUER: 0,
    SPRINGER: 1,
    LAEUFER: 2,
    TURM: 3,
    DAME: 4,
    KOENIG: 5,

    alsBuchstabe: function (a) {
        return 'pnbrqk'.charAt(a);
    },

    ausBuchstabe: function (c) {
        return 'pnbrqk'.indexOf(c.toLowerCase());
    }
};

/**
 * Erzeugt eine neue Figur
 *
 * @param {Farbe} farbe
 * @param {FigurenArt} art
 * @constructor
 */
function Figur(farbe, art) {
    this.farbe = farbe;
    this.art = art;
}

/**
 * Erzeugt eine Figur aus einem String.
 *
 * @param {String} c
 * @returns {Figur}
 * @static
 */
Figur.ausBuchstabe = function (c) {
    var art = FigurenArt.ausBuchstabe(c),
        farbe = (c === c.toUpperCase()) ? Farbe.WEISS : Farbe.SCHWARZ;
    return new Figur(farbe, art);
};

// TODO Welchen Zweck hat die Variable Feld hier? Folgt das einem Pattern?
// TODO Ist dies ein Modul? Oder sowas wie eine Klasse mit statischen Methoden in Java?
var Feld = {

    nameNachNr: function (name) {
        if (typeof (name) !== "string" || !name.match(/[a-h][1-8]/)) {
            // TODO Hier lieber Error schmeißen?
            return undefined;
        } else {
            var linie = name.charAt(0),
                reihe = name.charAt(1);
            return "abcdefgh".indexOf(linie) + (8 - reihe) * 8;
        }
    },

    nrNachName: function (nr) {
        // TODO Wieso ganzzahlige Division? Das Ergebnis ist nicht zwingend ganzzahling. Ist in JS anders als in Java.
        var spalte = nr % 8,
            zeile = (nr - spalte) / 8; // ganzzahlige Division
        return "abcdefgh".charAt(spalte) + (8 - zeile);
    },

    /**
     * Berechnet die Feldnummer aus Koordinaten (Zeile und Spalte).
     *
     * @param zeile Zeile, 0-7
     * @param spalte Spalte, 0-7
     * @return die Feldnummer (0-63), oder undefined, falls die Koordniaten ausserhalb des erlaubten Bereichs
     */
    ausKoordinaten: function (zeile, spalte) {
        if (zeile < 0 || zeile > 7 || spalte < 0 || spalte > 7) {
            return undefined;
        } else {
            return zeile * 8 + spalte;
        }
    },

    ausBewegung: function (start, dx, dy) {
        var spalte = start % 8,
            zeile = ((start - spalte)) / 8;

        spalte += dx;
        zeile += dy;

        if (zeile < 0 || zeile > 7 || spalte < 0 || spalte > 7) {
            return undefined;
        } else {
            return zeile * 8 + spalte;
        }
    },

    spalte: function (feldNummer) {
        return feldNummer % 8;
    },

    zeile: function (feldNummer) {
        return ((feldNummer - (feldNummer % 8))) / 8;
    }
};

/**
 *
 *
 * @param a ?
 * @param b ?
 * @constructor
 */
function Zug(a, b) {
    if (arguments.length === 2) {
        this.von = a;
        this.nach = b;
    } else if (arguments.length === 1 && typeof a !== "string") {
        this.von = Feld.nameNachNr(a.substr(0, 2));
        this.nach = Feld.nameNachNr(a.substr(2, 2));
    }
}

/**
 * @static
 */
Zug.ausZeichenkette = function(s) {
    var von, nach;
    if (typeof s === "string" && s.match(/[a-h][1-8][a-h][1-8]/)) {
        von = Feld.nameNachNr(s.substr(0, 2));
        nach = Feld.nameNachNr(s.substr(2, 2));
        return new Zug(von, nach);
    } else {
        return undefined;
    }
};

Zug.prototype.nachZeichenkette = function() {
    var sVon, sNach;

    sVon = Feld.nrNachName(this.von);
    sNach = Feld.nrNachName(this.nach);

    return sVon + sNach;
};

/**
 *
 * @param s TODO Was ist das? Alte Stellung?
 * @constructor
 */
function Stellung(s) {
    var zeile, i, aufstellung;

    this.brett = new Array(64);

    if (arguments.length === 0) {
        aufstellung = [ "rnbqkbnr", "pppppppp", "", "", "", "", "PPPPPPPP", "RNBQKBNR" ];
        this.amZug = Farbe.WEISS;

        for (zeile = 0; zeile < aufstellung.length; zeile += 1) {
            for (i = 0; i < aufstellung[zeile].length; i += 1) {
                this.brett[i + 8 * zeile] = Figur.ausBuchstabe(aufstellung[zeile].charAt(i));
            }
        }
    } else if (typeof s === "object") {
        this.amZug = s.amZug;
        for (i = 0; i < 64; i += 1) {
            this.brett[i] = s.brett[i];
        }
    }
}

Stellung.prototype.aufFeld = function (feld) {
    return this.brett[feld];
};

Stellung.prototype.fuehreZugAus = function (zug) {
    var neueStellung = new Stellung(this);
    neueStellung.amZug = Farbe.andere(this.amZug);

    neueStellung.brett[zug.nach] = neueStellung.brett[zug.von];
    neueStellung.brett[zug.von] = undefined;

    return neueStellung;
};

Stellung.prototype.istFrei = function (feld) {
    return this.brett[feld] === undefined;
};

// TODO Ist das hier node-Stil? Klappt das so? Du checkst auf module.exports, setzt aber nur exports?
// TODO Wenn das hier node ist, evtl. überlegen ein Modulkonzept zu nehmen, das unabhängig von node ist.
if (typeof module !== 'undefined' && module.exports) {
    exports.Farbe = Farbe;
    exports.FigurenArt = FigurenArt;
    exports.Figur = Figur;
    exports.Feld = Feld;
    exports.Zug = Zug;
    exports.Stellung = Stellung;
}