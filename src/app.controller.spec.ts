import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("AppController", () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe("root", () => {
		it("decimal system", () => {
			expect(
				appController.getNum({
					number: "12",
					fromBase: 10,
					toBase: 2,
				})
			).toBe("1100");
			expect(
				appController.getNum({
					number: "231",
					fromBase: 10,
					toBase: 8,
				})
			).toBe("347");
			expect(
				appController.getNum({
					number: "2315",
					fromBase: 10,
					toBase: 16,
				})
			).toBe("90B");
		});

		it("hexadecimal system", () => {
			expect(
				appController.getNum({
					number: "12AB",
					fromBase: 16,
					toBase: 2,
				})
			).toBe("1001010101011");
			expect(
				appController.getNum({
					number: "2A",
					fromBase: 16,
					toBase: 8,
				})
			).toBe("52");
			expect(
				appController.getNum({
					number: "2A",
					fromBase: 16,
					toBase: 10,
				})
			).toBe("42");
		});

		it("octal system", () => {
			expect(
				appController.getNum({
					number: "123",
					fromBase: 8,
					toBase: 2,
				})
			).toBe("1010011");
			expect(
				appController.getNum({
					number: "456",
					fromBase: 8,
					toBase: 10,
				})
			).toBe("302");
			expect(
				appController.getNum({
					number: "12314",
					fromBase: 8,
					toBase: 16,
				})
			).toBe("14CC");
		});

		it("binary system", () => {
			expect(
				appController.getNum({
					number: "1001010",
					fromBase: 2,
					toBase: 8,
				})
			).toBe("112");
			expect(
				appController.getNum({
					number: "10010101",
					fromBase: 2,
					toBase: 10,
				})
			).toBe("149");
			expect(
				appController.getNum({
					number: "1010010101010111",
					fromBase: 2,
					toBase: 16,
				})
			).toBe("A557");
		});

		it("should throw HttpException in binary system", async () => {
			// Arrange
			let errorThrown = false;

			// Act
			try {
				await appController.getNum({
					number: "10010102",
					fromBase: 2,
					toBase: 8,
				});
			} catch (error) {
				// Assert
				expect(error).toBeInstanceOf(HttpException);
				expect(error.message).toBe("двоичная система счисления включает в себя только два значения: 0 и 1");
				expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
				errorThrown = true;
			}

			expect(errorThrown).toBe(true);
		});

		it("should throw HttpException in octal system", async () => {
			// Arrange
			let errorThrown = false;

			// Act
			try {
				await appController.getNum({
					number: "1238",
					fromBase: 8,
					toBase: 2,
				});
			} catch (error) {
				// Assert
				expect(error).toBeInstanceOf(HttpException);
				expect(error.message).toBe("восьмеричная система счисления включает в себя только значения 0-7");
				expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
				errorThrown = true;
			}

			expect(errorThrown).toBe(true);
		});

		it("should throw HttpException in hexadecimal system", async () => {
			// Arrange
			let errorThrown = false;

			// Act
			try {
				await appController.getNum({
					number: "12ABG",
					fromBase: 16,
					toBase: 2,
				});
			} catch (error) {
				// Assert
				expect(error).toBeInstanceOf(HttpException);
				expect(error.message).toBe("для шестнадцатеричной системы счисления, являются допустимыми символы: 0-9 и A-F");
				expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
				errorThrown = true;
			}

			expect(errorThrown).toBe(true);
		});

		it("should throw HttpException in decimal system", async () => {
			// Arrange
			let errorThrown = false;

			// Act
			try {
				await appController.getNum({
					number: "12V",
					fromBase: 10,
					toBase: 2,
				});
			} catch (error) {
				// Assert
				expect(error).toBeInstanceOf(HttpException);
				expect(error.message).toBe("десятичная система счисления включает в себя только числовые значения: 0-9");
				expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
				errorThrown = true;
			}

			expect(errorThrown).toBe(true);
		});
	});
});
