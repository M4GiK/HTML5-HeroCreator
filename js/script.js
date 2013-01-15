/* Author: 

*/

function updateAbilityModifier(input) {
	var modifier = Math.floor((input.value - 10) / 2);
	document.getElementById(input.name + "_mod").value = (modifier > 0 ? "+" : "") + modifier;
}
