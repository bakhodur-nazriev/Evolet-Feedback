<?php

use App\Customer;
use App\Employee;
use App\Feedback;
use App\Group;
use App\Role;
use App\User;
use App\Comment;
use App\File;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DevSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(StatusesSeeder::class);
        $this->call(FeedbackTypesSeeder::class);
        $this->call(PCSeeder::class);
        $this->call(RolesSeeder::class);
        $this->seedGroups();
        
        $this->seedFactories([
            [
                'class' => User::class,
                'count' => 30,
            ],
            [
                'class' => Customer::class,
                'count' => 10,
            ],
            [
                'class' => Employee::class,
                'count' => 10,
            ],
            [
                'class' => Feedback::class,
                'count' => 100,
            ],
            [
                'class' => Comment::class,
                'count' => 100,
            ],
            [
                'class' => File::class,
                'count' => 100,
            ],
        ]);

        $this->seedUsers();
        $this->attachEmployeesToGroups();
    }
    
    private function seedUsers()
    {
        $akbar = User::create([
            'full_name' => "Akbar Ergashev",
            'email' => 'a@gmail.com',
            'password' => Hash::make('admin'),
        ]);
        Employee::create([
            'user_id' => $akbar->id,
            'avatar' => 'https://lorempixel.com/200/200/cats/?41078',
        ]);

        $akbar->roles()->attach(Role::where('name', Role::ADMIN_ROLE_NAME)->first());

        $employee = User::create([
            'full_name' => "Employee Employee",
            'email' => 'e@gmail.com',
            'password' => Hash::make('admin'),
        ]);
        Employee::create([
            'user_id' => $employee->id,
            'avatar' => 'https://lorempixel.com/200/200/cats/?41078',
        ]);

        $employee->roles()->attach(Role::where('name', Role::EMPLOYEE_ROLE_NAME)->first());

        $customer = User::create([
            'full_name' => 'Customer customer',
            'email' => 'c@gmail.com',
            'password' => Hash::make('admin'),
        ]);
        Customer::create([
            'user_id' => $customer->id,
            'pc_id' => 1,
        ]);

        $customer->roles()->attach(Role::where('name', Role::CUSTOMER_ROLE_NAME)->first());
    }

    private function seedGroups()
    {
        Group::truncate();
        Group::create(['name' => 'Упаковки']);
        Group::create(['name' => 'Инструкции']);
        Group::create(['name' => 'Сайт']);
    }

    private function attachEmployeesToGroups()
    {
        $groups = Group::all();

        foreach ($groups as $group) {
            $employeeCount = rand(1,3);

            for ($i=0; $i < $employeeCount; $i++) {
                $randomEmpoyee = Employee::inRandomOrder()->first();
                $group->employees()->attach($randomEmpoyee->id);
            }
        }
    }

    private function seedFactories($factories)
    {
        foreach ($factories as $factory) {
            $factory['class']::truncate();
            factory($factory['class'], $factory['count'])->create();
        }
    }
}
