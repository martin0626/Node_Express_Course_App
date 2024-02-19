class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        //1) Filtering
        let queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(f=>{delete queryObj[f]});
        
        //2) Advaced Filtering

        queryObj = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);


        this.query = this.query.find(JSON.parse(queryObj));

        return this;
    }

    sort(){
        // 3) Sorting: ?sort=-duration,maxGroupSize  
        //First sort by duration then by maxGroupSize. With minus we order descending otherwise ascending
        if(this.queryString.sort){
            this.query = this.query.sort(this.queryString.sort.split(',').join(' '));
        }else{
            this.query =  this.query.sort('-createdAt');
        }

        

        return this;
    }


    fieldsLimitation(){
        //4) Fields Limitation
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query= this.query.select('-__v');
        }

        return this;
    }


    pagination(){
        //5) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}


module.exports = APIFeatures; 