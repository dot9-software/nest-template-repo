import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum Resource {
  CALENDAR = 'calendar',
}

export enum AccessRight {
  READ = 'read',
  WRITE = 'write',
  READ_WRITE = 'read_write',
}

/**
 * ### `UserAccessRight` Entity
 * #### What is this?
 * This entity is used to save and manage all access rights (non-admin) users have over other users.
 *
 * #### What does this entity hold?
 * To achieve its functionality, this entity holds an accessing user (`right_holder`), an accessed user
 * (`accessed_user`), an accessed resource (`resource`) and a level of access rights (`access_right`).
 *
 * #### How does it work?
 * **How it works is best shown in an example:**
 *
 * Let's suppose for a second there are two users - Felix and Jonas. Felix is the boss of Jonas, so he has
 * to be able to see and edit everything Jonas has in his calendar. In this case, there exists an `UserAccessRight`
 * entry, where Felix is the `right_holder`, Jonas is the `accessed_user`, the `resource` is CALENDAR and the `access_right`
 * is READ_WRITE. This way, Felix's rights over Jonas' calendar are saved in one Entity.
 *
 * #### How do I load and alter the access rights of an user?
 * **Staying in the scenario of the previous example:**
 *
 * * If you want to see all of Felix's rights, you would GET Felix's `User` Entity via the `/users/:id` endpoint. Then the
 * relation `access_rights` of Felix's User, as well as the `accessed_user` relation on each `access_right` would be loaded in
 * automatically and you would be able to see all the permissions Felix has over other users, and in particular the names and
 * info of these accessed users as well.
 *
 * * If you want to remove all access rights from Felix, you would PATCH `users/:id` his entity with `{"access_rights": []}`
 *
 * * If you want to edit his access rights to only be "read" for Jonas' calendar, you'd pass along a
 * new array of all his access rights: (again, PATCH `/users/:id`)
 *   * `{"access_rights": [{"resource": "calendar", "access_right": "read", "accessed_user": {"id": $jonas-id}}]}`
 */
@Entity()
export class UserAccessRight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The resource the access is granted over.
   */
  @ApiProperty({
    type: 'enum',
    enum: Resource,
    enumName: 'Resource',
  })
  @Column({ enum: Resource, type: 'enum' })
  resource: Resource;

  /**
   * Decides what kind of access is granted: read, write, read & write
   */
  @ApiProperty({
    type: 'enum',
    enum: AccessRight,
    enumName: 'AccessRight',
  })
  @Column({ enum: AccessRight, type: 'enum' })
  access_right: AccessRight;

  /**
   * The "Owner" of this relation between users.
   * The right holder is granted the `access_rights` over the `resource` of the `accessed_user`
   * When loading this relation, the `right_holder` is loaded as their id in string form.
   */
  @ManyToOne(() => User, (u) => u.access_rights, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: false,
  })
  right_holder?: User;

  /**
   * The User access is granted over.
   */
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  accessed_user?: User;
}
