
/* see also
https://github.com/rdfjs-base/parser-jsonld/blob/6b200a9286c20ce6c03c83b76186740678964e17/lib/ParserStream.js#L38
and
https://github.com/digitalbazaar/jsonld.js/issues/243
 */

/*

//nope, this wouldn't work

function fix_jsonldjs_quad(quad:any)
{
	for (const x of [quad, quad.subject, quad.predicate, quad.object, quad.graph])
	{

		x.equals = Term.prototype.equals;

		if (x.termType === 'BlankNode' && x.value.startsWith('_:'))
			x.value = x.value.substring(2);
		if (x.termType === 'NamedNode' && x.value.startsWith('null:/'))
			// remove null:/ workaround for relative IRIs
			x.value = x.value.slice(6);
	}
}

*/

function n3lib_quad(x: any): n3.Quad
{
	return n3.DataFactory.quad(n3lib_term(x.subject), n3lib_term(x.predicate), n3lib_term(x.object), n3lib_term(x.graph))
}

function n3lib_term(plainTerm: any): any
{
	switch (plainTerm.termType)
	{
		case 'NamedNode':
			return n3.DataFactory.namedNode(plainTerm.value)
		case 'BlankNode':
			return n3.DataFactory.blankNode(plainTerm.value.substr(2))
		case 'Literal':
			return n3.DataFactory.literal(plainTerm.value, plainTerm.language || n3.DataFactory.namedNode(plainTerm.datatype.value))
		case 'DefaultGraph':
			return n3.DataFactory.defaultGraph()
		default:
			throw Error('unknown termType: ' + plainTerm.termType)
	}
}




function n3lib_quad_to_jld(x)
{
	return {subject:n3lib_term_to_jld(x.subject), predicate:n3lib_term_to_jld(x.predicate), object:n3lib_term_to_jld(x.object), graph:n3lib_term_to_jld(x.graph)}
}

function n3lib_term_to_jld(x)
{
	const termType = x.termType;
	const value = x.value;
	switch (termType)
	{
		case 'NamedNode':
			return {termType, value}
		case 'BlankNode':
			return {termType, value:'_:' + value}
		case 'Literal':
			r = {termType, value}
			if(x.language)
				r.language = x.language
			if(x.datatype)
				r.datatype = x.datatype
			return r
		case 'DefaultGraph':
			return {termType, value}
		default:
			throw Error('unknown termType: ' + termType)
	}
}

