import {MigrationInterface, QueryRunner} from "typeorm";

export class test1653911593096 implements MigrationInterface {
    name = 'test1653911593096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`photo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, \`comment\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_723fa50bf70dcfd06fb5a44d4f\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`moment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_12b5f241c827142ad0659cb826\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`moment_photos_photo\` (\`momentId\` int NOT NULL, \`photoId\` int NOT NULL, INDEX \`IDX_5c50d76abe2b795b5fd24593dc\` (\`momentId\`), INDEX \`IDX_5bcd8a35cd80d563b54c962d0e\` (\`photoId\`), PRIMARY KEY (\`momentId\`, \`photoId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`moment_photos_photo\` ADD CONSTRAINT \`FK_5c50d76abe2b795b5fd24593dc4\` FOREIGN KEY (\`momentId\`) REFERENCES \`moment\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`moment_photos_photo\` ADD CONSTRAINT \`FK_5bcd8a35cd80d563b54c962d0eb\` FOREIGN KEY (\`photoId\`) REFERENCES \`photo\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`moment_photos_photo\` DROP FOREIGN KEY \`FK_5bcd8a35cd80d563b54c962d0eb\``);
        await queryRunner.query(`ALTER TABLE \`moment_photos_photo\` DROP FOREIGN KEY \`FK_5c50d76abe2b795b5fd24593dc4\``);
        await queryRunner.query(`DROP INDEX \`IDX_5bcd8a35cd80d563b54c962d0e\` ON \`moment_photos_photo\``);
        await queryRunner.query(`DROP INDEX \`IDX_5c50d76abe2b795b5fd24593dc\` ON \`moment_photos_photo\``);
        await queryRunner.query(`DROP TABLE \`moment_photos_photo\``);
        await queryRunner.query(`DROP INDEX \`IDX_12b5f241c827142ad0659cb826\` ON \`moment\``);
        await queryRunner.query(`DROP TABLE \`moment\``);
        await queryRunner.query(`DROP INDEX \`IDX_723fa50bf70dcfd06fb5a44d4f\` ON \`photo\``);
        await queryRunner.query(`DROP TABLE \`photo\``);
    }

}
