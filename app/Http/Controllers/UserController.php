<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
        ]);

        //lowercase first b4 checking duplicates
        $firstname = strtolower($request->firstname);
        $lastname = strtolower($request->lastname);

        //check w/ both lower case first and last name
        $existingUser = User::whereRaw('LOWER(firstname) = ? AND LOWER(lastname) = ?', [$firstname, $lastname])
                        ->first();

        if ($existingUser) {
            return response()->json(['message' => 'User already exists'], 409);
        }

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
        ]);

        return response()->json($user, 201);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $firstname = $request->firstname;
        $lastname = $request->lastname;

        $lowercaseFirstname = strtolower($firstname);
        $lowercaseLastname = strtolower($lastname);

        $existingUser = User::whereRaw('LOWER(firstname) = ? AND LOWER(lastname) = ?', [$lowercaseFirstname, $lowercaseLastname])
                            ->where('id', '!=', $id)
                            ->first();

        if ($existingUser) {
            return response()->json(['message' => 'User already exists'], 409);
        }

        $user->update([
            'firstname' => $firstname,
            'lastname' => $lastname,
        ]);

        return response()->json($user, 200);
    }
}
