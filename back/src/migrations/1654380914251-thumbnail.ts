import {MigrationInterface, QueryRunner} from "typeorm";

export class thumbnail1654380914251 implements MigrationInterface {
    name = 'thumbnail1654380914251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`moment\` ADD \`thumbnail\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`moment\` DROP COLUMN \`thumbnail\``);
    }

}
