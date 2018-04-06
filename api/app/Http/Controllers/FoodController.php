<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Food;
use App\Http\Resources\FoodResource;
use App\Photo;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class FoodController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return FoodResource::collection(Food::all());
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request,[
            "name" => "required|min:3|max:50",
            "description" => "required|min:2|max:200",
            "price" => "required|numeric",
            "rate" => "required|numeric",
            "category_id" => "required|exists:food_categories,id",
            "img" => "required|array|min:1|max:5",
            "img.*" => "required"
        ]);
        \DB::beginTransaction();
        $i = 0;
        $food = new Food();
        $food->fill($request->all());
        $food->save();
        foreach ($request->img as $photo){
            $png_url = "/img/".time()."_".$i.".png";
            $path = public_path()."/storage". $png_url;
            $data = explode(',',$photo)[1];
            $data = base64_decode($data);
            Image::make($data)->resize(500,500)->save($path);
            $img = new Photo();
            $img->path = $png_url;
            $img->food_id = $food->id;
            if(!$img->save())
                \DB::rollBack();
            $i++;
        }
        \DB::commit();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Food  $food
     * @return \Illuminate\Http\Response
     */
    public function show(Food $food)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Food  $food
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Food $food)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Food  $food
     * @return \Illuminate\Http\Response
     */
    public function destroy(Food $food)
    {
        //
    }

    public function createComment(Request $request)
    {
        $this->validate($request, [
            "comment"=>"required|min:3|max:50",
            "user_id"=>"required|exists:users,id",
            "food_id"=>"required|exists:foods,id"

        ]);
        $comment = new Comment();
        $comment->fill($request->all());
        if ($comment->save())
            return response('done',200);

        return response('error',500);
    }


    public function updateComment(Request $request)
    {
        $this->validate($request,[
            "comment" => "required|min:3|max:50",
        ]);

        $comment = Comment::find($request->id);
        $comment->fill($request->all());
        if ($comment->save())
            return response('done',200);
        return response('error',500);
    }

    public function deleteComment(Request $request)
    {
        $comment = Comment::find($request->id);
        if ($comment->delete())
            return response('done',200);
        return response('error',500);
    }

}