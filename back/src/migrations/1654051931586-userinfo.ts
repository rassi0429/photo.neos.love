import {MigrationInterface, QueryRunner} from "typeorm";

export class userinfo1654051931586 implements MigrationInterface {
    name = 'userinfo1654051931586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(255) NOT NULL, \`twitterId\` varchar(255) NOT NULL, \`twitterImage\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_273a06d6cdc2085ee1ce7638b2\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`createDate\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`DROP INDEX \`IDX_273a06d6cdc2085ee1ce7638b2\` ON \`user_info\``);
        await queryRunner.query(`DROP TABLE \`user_info\``);
    }

}
