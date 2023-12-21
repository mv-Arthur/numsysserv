import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { posDto } from "./pos.dto";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post()
	getNum(@Body() pos: posDto): string {
		return this.appService.convertNum(pos);
	}
}
