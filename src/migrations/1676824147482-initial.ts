import { MigrationInterface, QueryRunner } from 'typeorm'

export class initial1676824147482 implements MigrationInterface {
    name = 'initial1676824147482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`userRole\` (\`userRoleUUID\` varchar(36) NOT NULL, \`role\` enum ('admin', 'teacher', 'student') NOT NULL DEFAULT 'student', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`userRoleUUID\`)) ENGINE=InnoDB`
        )
        await queryRunner.query(
            `CREATE TABLE \`user\` (\`userUUID\` varchar(36) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`userRoleUUID\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_638bac731294171648258260ff\` (\`password\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`userUUID\`)) ENGINE=InnoDB`
        )
        await queryRunner.query(
            `CREATE TABLE \`userRefreshToken\` (\`userRefreshTokenUUID\` varchar(36) NOT NULL, \`userUUID\` varchar(255) NOT NULL, \`deviceId\` varchar(255) NOT NULL, \`token\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_3d00b082f4e51c8a5df9e98596\` (\`userUUID\`, \`deviceId\`), PRIMARY KEY (\`userRefreshTokenUUID\`)) ENGINE=InnoDB`
        )
        await queryRunner.query(
            `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_e67f226597fe5502f0faf2074b9\` FOREIGN KEY (\`userRoleUUID\`) REFERENCES \`userRole\`(\`userRoleUUID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE \`userRefreshToken\` ADD CONSTRAINT \`FK_5c9ffd658871e3b02c6b5a17dd8\` FOREIGN KEY (\`userUUID\`) REFERENCES \`user\`(\`userUUID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`userRefreshToken\` DROP FOREIGN KEY \`FK_5c9ffd658871e3b02c6b5a17dd8\``)
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_e67f226597fe5502f0faf2074b9\``)
        await queryRunner.query(`DROP INDEX \`IDX_3d00b082f4e51c8a5df9e98596\` ON \`userRefreshToken\``)
        await queryRunner.query(`DROP TABLE \`userRefreshToken\``)
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``)
        await queryRunner.query(`DROP INDEX \`IDX_638bac731294171648258260ff\` ON \`user\``)
        await queryRunner.query(`DROP TABLE \`user\``)
        await queryRunner.query(`DROP TABLE \`userRole\``)
    }
}
