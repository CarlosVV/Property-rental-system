package ee.rental.app.core.model;

import javax.persistence.Entity;

@Entity
public class PropertyType extends BaseLookup{
	public PropertyType(){}
	public PropertyType(Long id,String name,String description) {
		super();
		this.setId(id);
		this.setName(name);
		this.setDescrription(description);
	}

}
