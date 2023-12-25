import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as addon from "../build/Release/addon.node";
import { posDto } from "./pos.dto";
function containsOnly01(str: string) {
	var regex = /^[01]+$/;
	return regex.test(str);
}

function containsDigitsOtherThan01234567(str: string) {
	var regex = /[^0-7]/;
	return regex.test(str) || str.match(/[a-zA-Z]/) !== null;
}

function containsDigitsAndLettersOtherThan01234567ABCDEF(str: string) {
	var regex = /[^0-7A-Fa-f]/;
	return regex.test(str);
}

function hasNonNumericCharacters(input: string): boolean {
	const regex = /\D/;
	return regex.test(input);
}

@Injectable()
export class AppService {
	convertNum(pos: posDto): string {
		if (pos.number === "") {
			throw new HttpException("поле не может быть пустым", HttpStatus.BAD_REQUEST);
		}

		if (hasNonNumericCharacters(pos.number) && pos.fromBase === 10) {
			throw new HttpException("десятичная система счисления включает в себя только числовые значения: 0-9", HttpStatus.BAD_REQUEST);
		}

		if (!containsOnly01(pos.number) && pos.fromBase === 2) {
			throw new HttpException("двоичная система счисления включает в себя только два значения: 0 и 1", HttpStatus.BAD_REQUEST);
		}

		if (containsDigitsOtherThan01234567(pos.number) && pos.fromBase === 8) {
			throw new HttpException("восьмеричная система счисления включает в себя только значения 0-7", HttpStatus.BAD_REQUEST);
		}

		if (containsDigitsAndLettersOtherThan01234567ABCDEF(pos.number) && pos.fromBase === 16) {
			throw new HttpException("для шестнадцатеричной системы счисления, являются допустимыми символы: 0-9 и A-F", HttpStatus.BAD_REQUEST);
		}

		return addon.convertBase(pos.number, pos.fromBase, pos.toBase);
	}
}
