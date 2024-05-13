/* Weapon Array organisation
0 - Name, 1 - FPBonus, 2 - Damage/Rnd, 3 - Coeff, 4 - Rounds, 5 - ModLight, 6 - ModMed, 7 - ModHvy, 8 - BaseReload, 9 - VolleyTime, 10 - CD, 11 - HTMLId
*/

const weaponlistdd = [
    ['Twin 100mm (Type 98)', 15, 12, 1.1, 4, 1, .5, .2, .96, .1, .26, 'ijn100mm'],
    ['Twin 130mm (B-2LM)', 35, 15, 1.25, 6, 1, .5, .2, 1.73, .16, .26, '130mmtwin'],
    ['Twin 114mm (QF Mk IV Prototype)', 25, 13, 1.25, 4, 1, .5, .2, 1.01, .1, .26, '114mmtwinmk4'],
    ['Twin 120mm (QF Mk XI)', 20, 17, 1.25, 4, 1, .5, .2, 1.46, .1, .26, '120mmtwinmk11']
];

const weaponlistca = [
    []
]

// Create selection list from weaponlist array

function createWeapons() {

    const opt = document.createElement("option");
    const sel = document.createTextNode("--select--");
    opt.value = "";
    opt.appendChild(sel);
    weapons.appendChild(opt);

    weaponlistdd.forEach(weapon => {

        const opt = document.createElement("option");
        opt.value = (`${weapon[weapon.length-1]}`);
        wName = document.createTextNode(`${weapon[0]}`);
        opt.appendChild(wName);
        weapons.appendChild(opt);

    })

};


//Page variable listener setup

const weapons = document.getElementById("weapons");
const shipRld = document.getElementById("Rld");
const shipFP = document.getElementById("FP");
const shipEff1 = document.getElementById("Eff1");
const FPBonus = document.getElementById("FPBonus");
const RldBonus = document.getElementById("RldBonus");

//Event listener functions

weapons.addEventListener("change", (e) => {
    
    let selweapon = e.target.value;
    let curweapon = [];

    
    weaponlistdd.forEach(weapon => {
        
        let weaponname = weapon[(weapon.length-1)]

        if (selweapon == weaponname) {

            curweapon = weapon;
        }
    });

    console.log(curweapon);

    //Process cycle time

    let cycleTime = cyclecalc(curweapon, shipRld.value);
    document.getElementById("wCycle").innerHTML = cycleTime;

    //Process DPH

    let dphArr = dphcalc(curweapon, shipFP.value, shipEff1.value);
    document.getElementById("wDPHLt").innerHTML = dphArr[0];
    document.getElementById("wDPHMed").innerHTML = dphArr[1];
    document.getElementById("wDPHHvy").innerHTML = dphArr[2];

    //Process DPS

    let dpsArr = dpscalc(curweapon, dphArr, cycleTime);
    document.getElementById("wDPSLt").innerHTML = dpsArr[0];
    document.getElementById("wDPSMed").innerHTML = dpsArr[1];
    document.getElementById("wDPSHvy").innerHTML = dpsArr[2];

});

//Calculator functions

function cyclecalc(curweapon, curRld) {

    return Number(((curweapon[8] * (Math.sqrt((200 / (curRld * (1 + (RldBonus.value / 100)) + 100))))) + curweapon[9] + curweapon[10]).toFixed(2));

};

function dphcalc(curweapon, shipFP, shipEff1) {

    let dphArr = [];
    
    // DPH = EquipmentDamage * Coeff * SlotEff * ArmourBonus * LevelAdj * (1 + AmmoBuff + Skill) * (1 + EnemyDebuff) * (1 + Hunter Skill) * ((100 + TotalFP(1 + Formation + FPSkillBonus))/100) + random({-1,...,3})

    console.log(curweapon, shipFP, (shipEff1 / 100));
        
    dphArr[0] = Number(((curweapon[2] * curweapon[3] * (shipEff1 / 100) * curweapon[5] * ((100 + Number(shipFP) + curweapon[1]) * (1 + (FPBonus.value / 100)) / 100)) + 3).toFixed(2));
    dphArr[1] = Number(((curweapon[2] * curweapon[3] * (shipEff1 / 100) * curweapon[6] * ((100 + Number(shipFP) + curweapon[1]) * (1 + (FPBonus.value / 100)) / 100)) + 3).toFixed(2));
    dphArr[2] = Number(((curweapon[2] * curweapon[3] * (shipEff1 / 100) * curweapon[7] * ((100 + Number(shipFP) + curweapon[1]) * (1 + (FPBonus.value / 100)) / 100)) + 3).toFixed(2));

    console.log(dphArr);

    return dphArr;

};

function dpscalc(curweapon, dphArr, cycleTime) {
    
    let dpsArr = [];

    //DPS = DPH * Rounds / Cycletime

    dpsArr[0] = Number((dphArr[0] * curweapon[4] / cycleTime).toFixed(2));
    dpsArr[1] = Number((dphArr[1] * curweapon[4] / cycleTime).toFixed(2));
    dpsArr[2] = Number((dphArr[2] * curweapon[4] / cycleTime).toFixed(2));

    return dpsArr;

};