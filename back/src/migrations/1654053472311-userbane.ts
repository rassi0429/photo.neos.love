import {MigrationInterface, QueryRunner} from "typeorm";

export class userbane1654053472311 implements MigrationInterface {
    name = 'userbane1654053472311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP COLUMN \`name\``);
    }

}
