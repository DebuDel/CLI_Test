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

}
